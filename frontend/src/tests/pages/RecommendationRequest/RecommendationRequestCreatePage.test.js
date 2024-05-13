import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequest tests", () => {

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
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /recommendationrequest", async () => {

        const queryClient = new QueryClient();
        const request = {
            id: 3,
            requesterEmail: "sta@ucsb.edu",
            professorEmail: "profb@ucsb.edu",
            explanation: "Explanation",
            dateRequested: "2023-02-02T00:00",
            dateNeeded: "2024-03-02T00:00",
            done: false
        };

        axiosMock.onPost("/api/recommendationrequests/post").reply(202, request);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId("RecommendationRequestForm-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'sta@ucsb.edu' } });
        fireEvent.change(professorEmailField, { target: { value: 'profb@ucsb.edu' } });
        fireEvent.change(explanationField, { target: { value: 'Explanation' } });
        fireEvent.change(dateRequestedField, { target: { value: '2023-02-02T00:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2024-03-02T00:00' } });
        fireEvent.change(doneField, { target: { value: false } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "requesterEmail": "sta@ucsb.edu",
            "professorEmail": "profb@ucsb.edu",
            "explanation": "Explanation",
            "dateRequested": "2023-02-02T00:00",
            "dateNeeded": "2024-03-02T00:00",
            "done": false
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New RecommendationRequest Created - id: 3 requesterEmail: sta@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });

    });
});


