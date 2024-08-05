package interknot.backend.comments;

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
class CommentController {
    private final CommentRepository commentRepository;

    CommentController(CommentRepository repository) {
        this.commentRepository = repository;
    }

    @GetMapping("/comments")
    CollectionModel<EntityModel<Comment>> all() {
        List<EntityModel<Comment>> comments = commentRepository.findAll().stream()
            .map(comment -> EntityModel.of(comment,
                    linkTo(methodOn(CommentController.class).one(comment.getCommentId())).withSelfRel(),
                    linkTo(methodOn(CommentController.class).all()).withRel("comments")))
            .collect(Collectors.toList());

		return CollectionModel.of(comments, linkTo(methodOn(CommentController.class).all()).withSelfRel());
    }

    @PostMapping("/comments")
    EntityModel<Comment> newComment(@RequestBody Comment comment) {
        Comment commentRes = commentRepository.saveAndFlush(comment);

        return EntityModel.of(commentRes,
            linkTo(methodOn(CommentController.class).one(commentRes.getCommentId())).withSelfRel(),
            linkTo(methodOn(CommentController.class).all()).withRel("commentss")
        );
    }

    @GetMapping("/comments/{id}")
    EntityModel<Comment> one(@PathVariable Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return EntityModel.of(comment,
            linkTo(methodOn(CommentController.class).one(id)).withSelfRel(),
            linkTo(methodOn(CommentController.class).all()).withRel("comments")
        );
    }

    @PutMapping("/comments/{id}")
    EntityModel<Comment> replaceComment(@PathVariable Long id, @RequestBody Comment commentBody) {
        Comment comment = commentRepository.findById(id).map(c -> {
            c.setContent(commentBody.getContent());
            return commentRepository.saveAndFlush(c);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return EntityModel.of(comment,
            linkTo(methodOn(CommentController.class).one(id)).withSelfRel(),
            linkTo(methodOn(CommentController.class).all()).withRel("comments")
        );
    }

    @DeleteMapping("/comments/{id}")
    void deleteComment(@PathVariable Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        commentRepository.deleteById(comment.getCommentId());
    }
}
