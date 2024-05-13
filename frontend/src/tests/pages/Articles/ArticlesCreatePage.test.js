import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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

describe("ArticlesCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const article = {
            id: 17,
            title: "test1",
            email: "tchoi@ucsb.edu",
            url: "test1.com",
            explanation: "testtesttest1",
            dateAdded: "2022-02-02T00:00"
        };

        axiosMock.onPost("/api/articles/post").reply( 202, article );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("ArticleForm-title")).toBeInTheDocument();
        });

        const titleField = screen.getByTestId("ArticleForm-title");
        const emailField = screen.getByTestId("ArticleForm-email");
        const urlField = screen.getByTestId("ArticleForm-url");
        const explanationField = screen.getByTestId("ArticleForm-explanation");
        const dateAddedField = screen.getByTestId("ArticleForm-dateAdded");
        const submitButton = screen.getByTestId("ArticleForm-submit");

        fireEvent.change(titleField, { target: { value: 'test1' } });
        fireEvent.change(emailField, { target: { value: 'tchoi@ucsb.edu' } });
        fireEvent.change(urlField, { target: { value: 'test1.com' } });
        fireEvent.change(explanationField, { target: { value: 'testtesttest1' } });
        fireEvent.change(dateAddedField, { target: { value: '2022-02-02T00:00' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "dateAdded": "2022-02-02T00:00",
            "explanation": "testtesttest1",
            "url": "test1.com",
            "email": "tchoi@ucsb.edu",
            "title": "test1"
        });

        expect(mockToast).toBeCalledWith("New Article Created - id: 17 title: test1");
        expect(mockNavigate).toBeCalledWith({ "to": "/articles" });
    });


});


