import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe('MenuItemReviewForm tests', () => {

    test('renders correctly', async () => {

        render(
            <Router>
                <MenuItemReviewForm/>
            </Router>
        );
        await screen.findByText(/Menu Item ID/);
        await screen.findByText(/Stars/);
        await screen.findByText(/Comment/);
        await screen.findByText(/Email/);
        await screen.findByText(/Date \(iso format\)/);
        await screen.findByText(/Create/);
    });


});