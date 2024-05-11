import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});
describe("MenuItemReviewCreatePage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {
        const queryClient = new QueryClient();
        const menuItemReview = {
            id: 3,
            itemId: 1,
            reviewerEmail: "test1@gmail.com",
            stars: 5,
            dateReviewed: "2021-08-01T00:00",
            comment: "Great food"
        };

        axiosMock.onPost("/api/menuitemreview/post").reply(200, menuItemReview);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Menu Item ID/)).toBeInTheDocument();
        });

        const itemIdInput = screen.getByLabelText(/Menu Item ID/);
        expect(itemIdInput).toBeInTheDocument();

        const reviewerEmailInput = screen.getByLabelText(/Email/);
        expect(reviewerEmailInput).toBeInTheDocument();

        const starsInput = screen.getByLabelText(/Stars/);
        expect(starsInput).toBeInTheDocument();

        const dateReviewedInput = screen.getByLabelText(/Date \(iso format\)/);
        expect(dateReviewedInput).toBeInTheDocument();

        const commentInput = screen.getByLabelText("Comment");
        expect(commentInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(itemIdInput, { target: { value: 1 } })
        fireEvent.change(reviewerEmailInput, { target: { value: 'test1@gmail.com' } })
        fireEvent.change(starsInput, { target: { value: 5 } })
        fireEvent.change(dateReviewedInput, { target: { value: '2021-08-01T00:00' } })
        fireEvent.change(commentInput, { target: { value: 'Great food' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            itemId: "1",
            reviewerEmail: "test1@gmail.com",
            stars: "5",
            dateReviewed: "2021-08-01T00:00",
            comment: "Great food"
        });
        expect(mockToast).toBeCalledWith("New menuItemReview Created - id: 3 itemId: 1 reviewerEmail: test1@gmail.com stars: 5 dateReviewed: 2021-08-01T00:00 comment: Great food");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
    });
});