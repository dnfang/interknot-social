package interknot.backend.users;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.security.crypto.bcrypt.BCrypt;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
class AuthController {

    private final UserRepository userRepository;

    AuthController(UserRepository repository) {
        this.userRepository = repository;
    }

    @PostMapping("/login")
    ResponseEntity<?> newUser(@RequestBody UserAccount userAccount) {
        // get user password
        String password = userAccount.getPassword();
        // verify password
        UserAccount user = userRepository.findById(userAccount.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        if (BCrypt.checkpw(password, user.getPassword())) {
            return ResponseEntity
                .status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_TYPE, MediaTypes.HTTP_PROBLEM_DETAILS_JSON_VALUE)
                .body(EntityModel.of(user,
                linkTo(methodOn(UserController.class).one(user.getId())).withSelfRel(),
                linkTo(methodOn(UserController.class).all()).withRel("users")
            ));
        }

        ErrorResponse err = new ErrorResponse("invalid password");
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .header(HttpHeaders.CONTENT_TYPE, MediaTypes.HTTP_PROBLEM_DETAILS_JSON_VALUE)
                .body(err);
    }
}
