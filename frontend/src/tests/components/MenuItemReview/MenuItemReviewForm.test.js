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
        expect(screen.getByText(/Create/)).toBeInTheDocument();
    });

    test("renders correctly when passing in a MenuItemReview", async () => {
        render(
            <Router>
                <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneMenuItemReview[0]}/>
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-id");
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId("MenuItemReviewForm-id")).toHaveValue(1);
        expect(screen.getByTestId("MenuItemReviewForm-itemId")).toHaveValue(69);
        expect(screen.getByTestId("MenuItemReviewForm-stars")).toHaveValue(5);
        expect(screen.getByTestId("MenuItemReviewForm-comment")).toHaveValue("this is so good!");
        expect(screen.getByTestId("MenuItemReviewForm-reviewerEmail")).toHaveValue("test1@gmail.com");
        expect(screen.getByTestId("MenuItemReviewForm-dateReviewed")).toHaveValue("2024-05-08T21:23:23.000");
    });

    test("Correct Error messsages on bad input", async () => {
        render(
            <Router>
                <MenuItemReviewForm/>
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(starsField, { target: { value: 10 } });
        fireEvent.change(dateReviewedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/A valid menu item ID is required/);
        expect(screen.getByText(/A valid date in iso format is required/)).toBeInTheDocument();
        expect(screen.getByText(/Maximum 5 stars/)).toBeInTheDocument();

        fireEvent.change(starsField, { target: { value: 0 } });
        fireEvent.click(submitButton);
        await screen.findByText(/Minimum 1 star/);
    });

    test("Correct Error messsages on missing input", async () => {
        render(
            <Router>
                <MenuItemReviewForm/>
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/A valid menu item ID is required/);
        expect(screen.getByText(/A valid date in iso format is required/)).toBeInTheDocument();
        expect(screen.getByText(/A valid number is required/)).toBeInTheDocument();
        expect(screen.getByText(/Your email is required/)).toBeInTheDocument();
        expect(screen.getByText(/A comment is required/)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();

        render(
            <Router>
                <MenuItemReviewForm submitAction={mockSubmitAction}/>
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");
        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const commentField = screen.getByTestId("MenuItemReviewForm-comment");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: 69 } });
        fireEvent.change(starsField, { target: { value: 5 } });
        fireEvent.change(commentField, { target: { value: "this is so good!" } });
        fireEvent.change(reviewerEmailField, { target: { value: "test1@gmail.com" } });
        fireEvent.change(dateReviewedField, { target: { value: "2024-05-08T21:23:23.000" } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/A valid menu item ID is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/A valid date in iso format is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/A valid number is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Your email is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/A comment is required/)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-cancel");
        const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });
});