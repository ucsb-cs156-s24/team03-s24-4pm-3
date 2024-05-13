import React from 'react';
import RecommendationRequestTable from 'main/components/RecommendationRequest/RecommendationRequestTable';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";
import { recommendationRequestFixtures } from 'fixtures/recommendationRequestFixtures';

export default {
    title: 'components/RecommendationRequests/RecommendationRequestTable',
    component: RecommendationRequestTable
};

const Template = (args) => {
    return (
        <RecommendationRequestTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    requests: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    requests: recommendationRequestFixtures.threeRecommendationRequests,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    requests: recommendationRequestFixtures.threeRecommendationRequests,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/recommendationrequests', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};

