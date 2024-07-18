package interknot.backend.users;

public class ErrorResponse {
    private String message;

    public ErrorResponse() {}

    public ErrorResponse(String msg) {
        this.message = msg;
    }

    // getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
