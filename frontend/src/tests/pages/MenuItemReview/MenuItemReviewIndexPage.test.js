import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MenuItemReviewIndexPage from "main/pages/menuItemReview/MenuItemReviewIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
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

describe("MenuItemReviewIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "MenuItemReviewTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {

        // arrange
        setupAdminUser();
        axiosMock.onGet("/api/menuitemreview/all").reply(200, []);

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        await waitFor(() => {
            expect(screen.getByText(/Create Menu Item Review/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Menu Item Review/);
        expect(button).toHaveAttribute('href', '/menuitemreview/create');
        expect(button).toHaveAttribute('style', 'float: right;')
    });

    test("does not render Create Button for non-admin user", async () => {
        setupUserOnly();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.queryByText(/Create Menu Item Review/)).not.toBeInTheDocument(); });
    });

    test("renders three menu item reviews", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/menuitemreview/all").reply(200, menuItemReviewFixtures.threeMenuItemReviews);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        });
        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("test2@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("2024-05-04T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-comment`)).toHaveTextContent("this sh*t is ass...");

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("69");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("test3@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("2024-05-08T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-comment`)).toHaveTextContent("yummy yummy in my tummy");

        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("43");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-reviewerEmail`)).toHaveTextContent("test1@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-stars`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-dateReviewed`)).toHaveTextContent("2024-05-08T20:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-comment`)).toHaveTextContent("mid af tbh");

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/menuitemreview/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/menuitemreview/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/menuitemreview/all").reply(200, menuItemReviewFixtures.threeMenuItemReviews);
        axiosMock.onDelete("/api/menuitemreview").reply(200, "MenuItemReview with id 2 was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-itemId`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-reviewerEmail`)).toHaveTextContent("test2@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-stars`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-dateReviewed`)).toHaveTextContent("2024-05-04T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-comment`)).toHaveTextContent("this sh*t is ass...");

        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-itemId`)).toHaveTextContent("69");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-reviewerEmail`)).toHaveTextContent("test3@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-stars`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-dateReviewed`)).toHaveTextContent("2024-05-08T21:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-comment`)).toHaveTextContent("yummy yummy in my tummy");

        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-itemId`)).toHaveTextContent("43");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-reviewerEmail`)).toHaveTextContent("test1@gmail.com");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-stars`)).toHaveTextContent("3");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-dateReviewed`)).toHaveTextContent("2024-05-08T20:23:23");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-comment`)).toHaveTextContent("mid af tbh");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/menuitemreview");
        expect(axiosMock.history.delete[0].url).toBe("/api/menuitemreview");
        expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
    });

});