import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ElectionResults from "./ElectionResults";
import SubmitResult from "./SubmitResult";
import { Layout, Typography, Menu } from "antd";
const { Header, Content } = Layout;
const { Title } = Typography;
// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function BasicExample() {
    return (
        <Router>
            <Layout>
                <Header>
                    <div
                        style={{
                            color: "#fff",
                            float: "left",
                            margin: "16px 24px 16px 0",
                            width: "120px",
                            height: "31px",
                            fontSize: "24px",
                            "background-color": "#fff"
                        }}
                    ></div>
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="1">
                            <span>Results</span>
                            <Link to="/" />
                        </Menu.Item>
                        <Menu.Item key="2">
                            <span>Submit a result</span>
                            <Link to="/submit-result" />
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content
                    style={{
                        margin: 24,
                        minHeight: 280
                    }}
                >
                    <Switch>
                        <Route exact path="/">
                            <ElectionResults />
                        </Route>
                        <Route path="/submit-result">
                            <SubmitResult />
                        </Route>
                    </Switch>
                </Content>
            </Layout>
        </Router>
    );
}

// You can think of these components as "pages"
// in your app.

function Home() {
    return (
        <div>
            <h2>Home</h2>
        </div>
    );
}

function About() {
    return (
        <div>
            <h2>About</h2>
        </div>
    );
}

function Dashboard() {
    return (
        <div>
            <h2>Dashboard</h2>
        </div>
    );
}
