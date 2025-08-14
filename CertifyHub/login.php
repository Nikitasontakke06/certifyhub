<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - CERTIFYHUB.com</title>
    <link rel="stylesheet" href="main.css">
    <style>
        
    </style>
</head>
<body>
    <div class="main">
   
	 <div class="icon">
                <h1 class="logo" style="color:white;">CertifyHub.com</h1>
            </div>

        <!-- Login form -->
        <div class="form">
            <h2 style="color:black;">Login Here</h2>
            <?php
            
            $login_error = "";

            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                
                $login_email = $_POST["email"];
                $login_password = $_POST["password"];

                
                if (empty($login_email) || empty($login_password)) {
                    $login_error = "Email and password are required.";
                } else {
                    echo "Email: $login_email";
                    echo "Password: $login_password";
                }
            }
            ?>

            <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <input type="email" name="email" placeholder="Enter Email Here"><br><br>
                <input type="password" name="password" placeholder="Enter Password Here"><br><br>
                <button class="btnn" type="submit"><a href="main.html">LOGIN</a></button>
                <p class="link" style="color:white;"><br>
                <a href="#" id="showSignupForm">Sign up</a>
              </p>
            </form>
            <p class="link" style="color:white;"><?php echo $login_error; ?></p>
        </div>

        <!-- Signup form -->
        <div class="form form-container" style="display: none;" id="signupForm">
            <h2 style="color:black;">Sign Up Here</h2>
            <?php
            $login_error = "";
            if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['login'])) {
                $login_email = $_POST["email"];
                $login_password = $_POST["password"];

                if (empty($login_email) || empty($login_password)) {
                    $login_error = "Email and password are required.";
                } else {
                    // Database connection
                    $conn = new mysqli('localhost', 'root', '', 'newlogin');
                    if ($conn->connect_error) {
                        die("Connection failed: " . $conn->connect_error);
                    }

                    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND password = ?");
                    $stmt->bind_param("ss", $login_email, $login_password);
                    $stmt->execute();
                    $result = $stmt->get_result();

                    if ($result->num_rows > 0) {
                        // Start session (if not already started)
                        session_start();
                        
                        // Store user information in session for future use (optional)
                        $_SESSION['user_email'] = $login_email;
                        
                        // Redirect to main page
                        header("Location: main.html");
                        exit(); // Make sure to exit after redirection
                    } else {
                        $login_error = "Invalid email or password.";
                    }

                    $stmt->close();
                    $conn->close();
                }
		 
            }
            ?>

            <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <input type="email" name="signup_email" placeholder="Enter Email Here"><br><br>
                <input type="password" name="signup_password" placeholder="Create Password Here"><br><br>
                <input type="password" name="signup_confirm_password" placeholder="Confirm Password Here"><br><br>
                <button class="btnn" type="submit"><a href="main.html">SIGN UP</a></button>
            </form>
            <p class="link" style="color:white;"><?php echo $signup_error; ?></p>
        </div>
    </div>

    <script>
        // JavaScript to toggle visibility of the signup form
        document.getElementById('showSignupForm').addEventListener('click', function() {
            document.getElementById('signupForm').style.display = 'block';
        });
    </script>
</body>
</html>
