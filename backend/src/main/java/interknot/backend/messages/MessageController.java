package interknot.backend.messages;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
class MessageController {
    private final MessageRepository messageRepository;

    MessageController(MessageRepository repository) {
        this.messageRepository = repository;
    }

    @GetMapping("/messages")
    CollectionModel<EntityModel<Message>> all() {
        List<EntityModel<Message>> messages = messageRepository.findAll().stream()
            .map(message -> EntityModel.of(message,
                    linkTo(methodOn(MessageController.class).one(message.getMessageId())).withSelfRel(),
                    linkTo(methodOn(MessageController.class).all()).withRel("messages")))
            .collect(Collectors.toList());

		return CollectionModel.of(messages, linkTo(methodOn(MessageController.class).all()).withSelfRel());
    }

    @PostMapping("/messages")
    EntityModel<Message> newMessage(@RequestBody Message message) {
        Message messageRes = messageRepository.saveAndFlush(message);

        return EntityModel.of(messageRes,
            linkTo(methodOn(MessageController.class).one(messageRes.getMessageId())).withSelfRel(),
            linkTo(methodOn(MessageController.class).all()).withRel("messages")
        );
    }

    @GetMapping("/messages/{id}")
    EntityModel<Message> one(@PathVariable Long id) {
        Message message = messageRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return EntityModel.of(message,
            linkTo(methodOn(MessageController.class).one(id)).withSelfRel(),
            linkTo(methodOn(MessageController.class).all()).withRel("messages")
        );
    }

    @DeleteMapping("/messages/{id}")
    void deleteMessage(@PathVariable Long id) {
        Message message = messageRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        messageRepository.deleteById(message.getMessageId());
    }
}
