package interknot.backend.posts;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LoadPostDatabase {
    private static final Logger log = LoggerFactory.getLogger(LoadPostDatabase.class);

    @Bean
    CommandLineRunner initPostDatabase(PostRepository repository) {

        return args -> {};
    }    
}
