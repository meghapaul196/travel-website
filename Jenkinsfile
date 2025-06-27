pipeline {
    agent any

    tools {
        nodejs 'node-18' // Set this up in Global Tool Configuration
    }

    options {
        skipDefaultCheckout()
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/meghapaul196/travel-website.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        bat 'npm install'
                    } else {
                        echo 'No package.json found, skipping npm install.'
                    }
                }
            }
        }

        stage('Lint and Test (Optional)') {
            steps {
                echo 'Running linting and tests (if configured)...'
                // bat 'npm run lint' // if applicable
                // bat 'npm test'     // if applicable
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('Sonarkey') {
                        bat 'sonar-scanner -Dsonar.projectKey=travelaja -Dsonar.projectName="Travelaja Website" -Dsonar.sources=. -Dsonar.exclusions=bookings.json,node_modules/** -Dsonar.sourceEncoding=UTF-8 -Dsonar.javascript.linter.eslint.reportPaths=eslint-report.json -Dsonar.javascript.node.maxspace=2048'
                    }
                }
            }
            post {
                failure {
                    echo 'SonarQube analysis failed or Quality Gate not passed.'
                }
            }
        }

        stage('Build (Optional)') {
            steps {
                echo 'No specific build step required for this static site.'
                // bat 'npm run build' // if needed
            }
        }

        stage('Deploy') {
            steps {
                echo 'Starting deployment...'
                bat '''
                    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5500') do taskkill /F /PID %%a >nul 2>&1 || echo No process running on port 5500
                    start /b cmd /c "node server.js > server.log 2>&1"
                '''
                echo 'Node.js server started on port 5500.'
            }
        } 
    } 

    post {
        always {
            echo 'Pipeline finished.'
            deleteDir()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
