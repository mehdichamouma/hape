import React, { useState, useEffect } from "react";
import {
    Table,
    Divider,
    Typography,
    Layout,
    List,
    Avatar,
    Row,
    Col,
    Upload,
    Message,
    Button,
    Modal,
    Result,
    Select
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

const data = {
    resultsByVotingPolls: [
        {
            key: "1",
            name: "North Zone",
            city: "Squarepolis",
            "can-1": "12% (745 votes)",
            "can-2": "12% (745 votes)",
            "can-3": "13% (345 votes)",
            "can-4": "13% (345 votes)",
            zip: "76500"
        }
    ]
};

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name"
    },
    {
        title: "City",
        dataIndex: "city",
        key: "city"
    },
    {
        title: "Zip Code",
        dataIndex: "zip",
        key: "zip"
    }
];

const candidatePreview = [
    {
        name: "Super Circle",
        count: 120
    },
    {
        name: "The Square",
        count: 145
    },
    {
        name: "Perfect Triangle",
        count: 300
    },
    {
        name: "Ultimate Pentagon",
        count: 140
    }
];

const previewColumns = [
    {
        title: "Candidate",
        dataIndex: "candidate",
        key: "name"
    },
    {
        title: "Vote count",
        dataIndex: "count",
        key: "count"
    }
];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export default function SubmitResult() {
    const [selectedPs, setSelectedPs] = useState(0);
    const [pollingStations, setPollingStations] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [step, setStep] = useState(1);
    const [confirmModal, setConfirmModal] = useState(false);
    const [previewModal, setPreviewModal] = useState(false);
    useEffect(function () {
        async function load() {
            const res = await fetch("http://localhost:5000/polling-stations");
            const data = await res.json();
            setPollingStations(data);
            const res2 = await fetch("http://localhost:5000/candidates");
            const data2 = await res2.json();
            setCandidates(data2);
        }
        load();
    }, []);

    function generatePreview() {
        const preview = candidates.map(can => ({
            ...can,
            count: getRandomInt(100, 3000)
        }));
        setPreviewData(preview);
    }
    return (
        <Layout>
            <h1>Submit a result for your voting poll</h1>
            <p>Powered by Hashgraph and Dragonglass</p>
            <Layout style={{ "background-color": "#fff", padding: 24 }}>
                <Row>
                    <Col span={24}>
                        <h2>Your voting poll</h2>
                        <Select defaultValue={0} onSelect={setSelectedPs}>
                            {pollingStations.map((ps, index) => {
                                return <Option value={index}>{ps.name}</Option>;
                            })}
                        </Select>
                        {pollingStations.length > 0 && (
                            <Table
                                dataSource={[pollingStations[selectedPs]] || []}
                                columns={columns}
                                pagination={{
                                    hideOnSinglePage: true
                                }}
                            />
                        )}
                    </Col>
                </Row>
            </Layout>
            <Divider />
            <Layout style={{ "background-color": "#fff", padding: 24 }}>
                <Row>
                    <Col span={24}>
                        <h2>Submit a result</h2>
                        <Dragger
                            onChange={function (info) {
                                generatePreview();
                                setPreviewModal(true);
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Please submit the picture of the vote paper with
                                the result per candidate{" "}
                            </p>
                        </Dragger>
                    </Col>
                </Row>
            </Layout>
            <Modal
                title="Confirm informations"
                visible={previewModal}
                okText="Yes, submit on HAPE"
                cancelText="No, retake a picture"
                onCancel={function () {
                    setPreviewModal(false);
                }}
                onOk={async function () {
                    const res = await fetch("http://localhost:5000/result", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            pollingStationId: pollingStations[selectedPs].key,
                            results: previewData.reduce(
                                (o, row) => ({
                                    ...o,
                                    [row.key]: row.count
                                }),
                                {}
                            )
                        })
                    });
                    const data = await res.json();
                    console.log(data);
                    setPreviewModal(false);
                    setConfirmModal(true);
                }}
            >
                <p>These results are simulated</p>
                <Table
                    dataSource={previewData}
                    columns={previewColumns}
                    pagination={{
                        hideOnSinglePage: true
                    }}
                />
                <h3>Are the informations correct ?</h3>
            </Modal>
            <Modal title="Result has been processed" visible={confirmModal} onOk={() => setConfirmModal(false)} cancelText={null}>
                <Result
                    status="success"
                    title="Successfully processed vote result"
                    subTitle="Hedera Hashgraph Transaction ID: XXXXXXXXXX The transaction has been accepted by the HCS"
                />
            </Modal>
        </Layout>
    );
}
