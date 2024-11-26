const signupData = {
     validUser: {
          email: "test.integration@example.com",
          password: "password123",
          confirmPassword: "password123",
          firstname: "John",
          lastname: "Doe",
          username: "johndoe",
          avatar_url: "https://example.com/avatar.jpg",
     },
     invalidUser: {
          email: "invalid-email",
          password: "pass",
          confirmPassword: "different",
          firstname: "",
          lastname: "",
          username: "",
     },
}

module.exports = signupData
