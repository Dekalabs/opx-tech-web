# Transformers

When we perform a request to the backend, it returns a JSON with its own casing. In the case of Django backends, snake
casing is used, which is not the usual casing used in JavaScript. At the same time, this difference must be addressed
before sending any data back to the server.

Also, it's convenient if the data arriving from de backend is transformed to the appropriate types before entering the
application code, so we don't need to perform data transformations in components or utility functions.

With these two objectives in mind, we created transformers, which are in charge of performing these conversions right
after receiving data and before sending data to the server.

## How they work

Transformers must implement two static methods:

- `receive`: transforms the data after receiving a response from the backend.
- `send`: transforms the data before sending a response from the backend.

Both methods receive and must return an object.

There is a `BaseTransformer` implementing two convenience methods for lists: `receiveCollection` and `sendCollection`.
These methods receive an array and execute the `receive` or the `send` on every item of that array.

## Examples:

### Implementation

```javascript
import Transformer from '@/transformers/base/BaseTransformer'
class UserTransformer extends Transformer {
  static receive(user) {
    return {
      email: user.email, // No conversion
      firstName: user.first_name, // Casing conversion
      birthDate: new Date(user.birth_date), // Casing & type conversion (dates come as strings)
    }
  }
  static send(user) {
    return {
      email: user.email, // No conversion
      first_name: user.firstName, // Casing conversion
      birth_date: user.date.toISOString().split('T')[0], // Type conversion: get the date from a Date instance
    }
  }
}
export default LoginTransformer
```
