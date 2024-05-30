package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;


import edu.ucsb.cs156.example.WebTestCase;
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
        
    @Test
    public void admin_user_can_create_edit_delete_restaurant() throws Exception {
         
        setupUser(true);
        page.getByText("Recommendation Request").click();

        page.getByText("Create Recommendation Request").click();
        assertThat(page.getByText("Create New Recommendation Request")).isVisible();
        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("a@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("p@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-explanation").fill("Test Message for Reccomendation Request");
        page.getByTestId("RecommendationRequestForm-dateRequested").fill("2022-01-03T00:00");
        page.getByTestId("RecommendationRequestForm-dateNeeded").fill("2022-02-03T00:00");
        page.getByTestId("RecommendationRequestForm-done").click();
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation"))
                .hasText("Test Message for Reccomendation Request");
            
        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Recommendation Request")).isVisible();
        page.getByTestId("RecommendationRequestForm-explanation").fill("Modified Test Message for Reccomendation Request");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation")).hasText("Modified Test Message for Reccomendation Request");

        page.getByTestId("RecommendationRequestTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail")).not().isVisible();
    }

}