const recommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requesterEmail": "ak@ucsb.edu",
        "professorEmail": "phtcon@ucsb.edu",
        "explanation": "BS/MS Program",
        "dateRequested": "2024-05-09T21:48:00",
        "dateNeeded": "2024-05-09T21:48:00",
        "done": true
    },
threeRecommendationRequests: [
    {
        "id": 2,
        "requesterEmail": "ak@ucsb.edu",
        "professorEmail": "profa@ucsb.edu",
        "explanation": "Program A",
        "dateRequested": "2024-05-09T21:48:00",
        "dateNeeded": "2024-05-10T21:48:00",
        "done": false
    },
    {
        "id": 3,
        "requesterEmail": "ak@ucsb.edu",
        "professorEmail": "profb@ucsb.edu",
        "explanation": "Program B",
        "dateRequested": "2024-05-09T21:48:00",
        "dateNeeded": "2024-05-11T21:48:00",
        "done": true
    },
    {
        "id": 4,
        "requesterEmail": "ak@ucsb.edu",
        "professorEmail": "profc@ucsb.edu",
        "explanation": "Program C",
        "dateRequested": "2024-05-09T21:48:00",
        "dateNeeded": "2024-05-12T21:48:00",
        "done": false
    }
]
};

export { recommendationRequestFixtures };