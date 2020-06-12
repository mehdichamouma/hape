const candidates = [
    {
        key: "can-1",
        photo: `https://loremflickr.com/320/240/circle?random=22`,
        candidate: "Super Cercle",
        description: "The party of the order"
    },
    {
        key: "can-2",
        photo: `https://loremflickr.com/320/240/square?random=22`,
        candidate: "The Square",
        description: "The party of the workers"
    },
    {
        key: "can-3",
        photo: `https://loremflickr.com/320/240/triangle?random=22`,
        candidate: "Perfect Triangle",
        description: "The party of the education"
    },
    {
        key: "can-4",
        photo: `https://loremflickr.com/320/240/pentagon?random=22`,
        candidate: "Ultimate Pentagon",
        description: "The party of the army"
    }
];

const pollingStationResults = [
    {
        pollingStation: "PS-1",
        "can-1": 200,
        "can-2": 410,
        "can-3": 840,
        "can-4": 120
    },
    {
        pollingStation: "PS-2",
        "can-1": 200,
        "can-2": 410,
        "can-3": 840,
        "can-4": 120
    },
    {
        pollingStation: "PS-3",
        "can-1": 200,
        "can-2": 410,
        "can-3": 840,
        "can-4": 120
    },
    {
        pollingStation: "PS-4",
        "can-1": 200,
        "can-2": 410,
        "can-3": 840,
        "can-4": 120
    }
];

const pollingStations = [
    {
        key: "PS-1",
        name: "North Zone",
        city: "Squarepolis",
        zip: "01250",
        results: {
            "can-1": 3200,
            "can-2": 862,
            "can-3": 1500,
            "can-4": 4100
        }
    },
    {
        key: "PS-2",
        name: "South Zone",
        city: "Circlepolis",
        zip: "76500"
    },
    {
        key: "PS-3",
        name: "East Zone",
        city: "TriangleTown",
        zip: "14500"
    },
    {
        key: "PS-4",
        name: "West Zone",
        city: "Polygon City",
        zip: "12000",
        results: {
            "can-1": 200,
            "can-2": 410,
            "can-3": 840,
            "can-4": 120
        }
    }
];

module.exports = {
    candidates,
    pollingStations,
    pollingStationResults
};
