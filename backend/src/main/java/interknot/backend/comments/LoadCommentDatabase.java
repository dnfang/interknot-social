package interknot.backend.comments;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LoadCommentDatabase {
    private static final Logger log = LoggerFactory.getLogger(LoadCommentDatabase.class);

    @Bean
    CommandLineRunner initCommentDatabase(CommentRepository repository) {

        return args -> {};
    }    
}
