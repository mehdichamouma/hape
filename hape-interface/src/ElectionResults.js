import React, { useState, useEffect } from "react";
import {
    Table,
    Divider,
    Typography,
    Layout,
    List,
    Avatar,
    Row,
    Col
} from "antd";

const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const data = {
    resultsByCandidates: [
        {
            key: "2",
            photo: `https://loremflickr.com/320/240/circle?random=22`,
            candidate: "Super Cercle",
            description: "The party of the order",
            result: "14% (1 200 444 votes)"
        },
        {
            key: "3",
            photo: `https://loremflickr.com/320/240/square?random=22`,
            candidate: "The Square",
            description: "The party of the workers",
            result: "36% (3 480 998 votes)"
        },
        {
            key: "4",
            photo: `https://loremflickr.com/320/240/triangle?random=22`,
            candidate: "Perfect Triangle",
            description: "The party of the education",
            result: "22% (2 800 988 votes)"
        },
        {
            key: "5",
            photo: `https://loremflickr.com/320/240/pentagon?random=22`,
            candidate: "Ultimate Pentagon",
            description: "The party of the army",
            result: "23% (2 962 300 votes)"
        }
    ],
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
        },
        {
            key: "1",
            name: "North Zone",
            city: "Squarepolis",
            "can-1": "12% (745 votes)",
            "can-2": "12% (745 votes)",
            "can-3": "13% (345 votes)",
            "can-4": "13% (345 votes)",
            zip: "76500"
        },
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
    },
    {
        title: "Super Circle",
        dataIndex: "can-1",
        key: "can-1"
    },
    {
        title: "The Square",
        dataIndex: "can-2",
        key: "can-2"
    },
    {
        title: "Perfect Triangle",
        dataIndex: "can-3",
        key: "can-3"
    },
    {
        title: "Ultimate Pentagon",
        dataIndex: "can-4",
        key: "can-4"
    }
];

export default function ElectionResults() {
    const [results, setResults] = useState({});
    useEffect(function () {
        async function updateResults() {
            const res = await fetch("http://localhost:5000/results");
            console.log("ok");
            const data = await res.json();
            console.log(data);
            setResults({
                ...data,
                resultsByCandidates: data.resultsByCandidates.map(function (
                    row
                ) {
                    return {
                        ...row,
                        result: `${row.percent}% (${row.count} votes)`
                    };
                }),
                pollingStationsColumns: [
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
                    },
                    ...data.candidates.map(can => ({
                        title: can.candidate,
                        dataIndex: can.key,
                        key: can.key
                    }))
                ],
                resultsByPollingStation: data.resultsByPollingStation.map(
                    row => {
                        return {
                            ...row,
                            ...Object.keys(row.results).reduce((o, canKey) => {
                                return {
                                    ...o,
                                    [canKey]: `${row.results[canKey].percent}% (${row.results[canKey].count} votes)`
                                };
                            }, {})
                        };
                    }
                )
            });
        }
        updateResults();
    }, []);

    return (
        <Layout>
            <h1>Presidential Election of FlatLand</h1>
            <p>Powered by Hashgraph and Dragonglass</p>
            <Layout style={{ "background-color": "#fff", padding: 24 }}>
                <Row>
                    <Col span={24}>
                        <h2>Live results</h2>
                        <List
                            dataSource={results.resultsByCandidates}
                            renderItem={item => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.photo} />}
                                        title={
                                            <a href="https://ant.design">
                                                {item.candidate}
                                            </a>
                                        }
                                        description={item.description}
                                    />
                                    <div>{item.result}</div>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </Layout>
            <Divider />
            <Layout style={{ "background-color": "#fff", padding: 24 }}>
                <Row>
                    <Col span={24}>
                        <h2>Results by voting polls</h2>
                        <Table
                            dataSource={results.resultsByPollingStation}
                            columns={results.pollingStationsColumns}
                        />
                    </Col>
                </Row>
            </Layout>
        </Layout>
    );
}
