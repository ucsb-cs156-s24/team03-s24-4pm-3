package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
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
public class ArticleWebIT extends WebTestCase {

    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        page.getByText("Create Article").click();
        assertThat(page.getByText("Create New Article")).isVisible();

        page.getByLabel("Title of Article").fill("Big News");
        page.getByLabel("URL").fill("ww.news.com");
        page.getByLabel("Explanation").fill("Big News Alert");
        page.getByLabel("Email").fill("newsman@gmail.com");
        page.getByLabel("Date Added(iso format)").fill("2022-01-03T00:00:00");

        page.getByText("Create").click();

        assertThat(page.getByText("Big News Alert")).isVisible();

        page.getByText("Edit").click();
        assertThat(page.getByText("Edit Article")).isVisible();

        page.getByLabel("Explanation").fill("HUGE NEWS");

        page.getByText("Update").click();

        assertThat(page.getByText("HUGE NEWS")).isVisible();

        page.getByText("Delete").click();

        assertThat(page.getByText("HUGE NEWS")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_article() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Article")).not().isVisible();
        assertThat(page.getByText("Big News")).not().isVisible();
    }
}
