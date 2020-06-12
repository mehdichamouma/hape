var express = require("express");
var cors = require("cors");
var app = express();
const { init, sendMessage } = require("./hedera");
const {
    candidates,
    pollingStationResults,
    pollingStations
} = require("./data");
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
// respond with "hello world" when a GET request is made to the homepage
app.get("/", function (req, res) {
    res.send("hello world");
});

function onMessage(message) {
    const body = JSON.parse(message.Body);
    body.data.forEach(row => {
        let content = row.message.message;
        content = Buffer.from(content, "hex").toString();
        content = JSON.parse(content);
        const ps = pollingStations.find(ps2 => ps2.key === content.pollingStationId)
        if(ps) {
            ps.results = content.results;
        }
    });
}

init(onMessage).then(() => {
    app.listen(PORT, function () {
        console.log("Example app listening on port PORT!");
    });
});

app.post("/result", function (req, res) {
    const data = req.body;
    console.log(data);
    sendMessage(JSON.stringify(data));
    res.send({
        ok: true
    });
});

app.get("/polling-stations", function(req, res) {
    res.send(pollingStations);
})

app.get("/candidates", function(req, res) {
    res.send(candidates);
})

app.get("/results", function (req, res) {
    let resultsByCandidates = candidates.map(function (can) {
        return {
            ...can,
            count: pollingStations.reduce(function (tot, ps) {
                if (ps.results && ps.results[can.key]) {
                    return tot + ps.results[can.key];
                }
                return tot;
            }, 0)
        };
    });
    const totalCount = resultsByCandidates.reduce(function (tot, can) {
        return tot + can.count;
    }, 0);
    resultsByCandidates = resultsByCandidates.map(function (can) {
        return {
            ...can,
            percent: parseFloat(100 * (can.count / totalCount)).toFixed(2)
        };
    });
    const resultsByPollingStation = pollingStations.reduce((arr, ps) => {
        if (!ps.results) {
            return arr;
        }
        const totalCount = Object.keys(ps.results).reduce((tot, canKey) => {
            return tot + ps.results[canKey];
        }, 0);
        return [
            ...arr,
            {
                ...ps,
                results: Object.keys(ps.results).reduce((o, canKey) => {
                    const count = ps.results[canKey];
                    return {
                        ...o,
                        [canKey]: {
                            count,
                            percent: parseFloat(
                                100 * (count / totalCount)
                            ).toFixed(2)
                        }
                    };
                }, {})
            }
        ];
    }, []);

    res.send({
        candidates,
        resultsByCandidates,
        resultsByPollingStation
    });
});
