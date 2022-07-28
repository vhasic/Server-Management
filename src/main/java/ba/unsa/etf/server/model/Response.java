package ba.unsa.etf.server.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;

/*
 * Response class is used to return successful or unsuccessful response to client.
 */
@Data
@SuperBuilder   //using builder pattern to create response object
@JsonInclude(JsonInclude.Include.NON_NULL) //doesn't serialize null values
public class Response {
    protected LocalDateTime timestamp;
    protected Integer statusCode;
    protected HttpStatus status;
    protected String reason;
    protected String message;
    protected String developerMessage;  //if response is successful, this field is null
    protected Map<?, ?> data;
}
