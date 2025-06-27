// Jenkinsfile

pipeline {
    agent any // This specifies that the pipeline can run on any available agent

    tools {
        // You need to configure 'SonarQubeScanner' in Jenkins Global Tool Configuration
        // under 'Manage Jenkins -> Global Tool Configuration -> SonarQube Scanner installations'
        // and give it a name, e.g., 'SonarQubeScanner_4.x'
        // Replace 'SonarQubeScanner_Name' with the actual name you configured in Jenkins.
        nodejs 'node-18' // Assuming you have Node.js 18 configured in Jenkins Global Tool Configuration
    }

    options {
        // Clean workspace before pipeline execution to ensure a fresh build
        skipDefaultCheckout() // We'll handle checkout manually in the 'Checkout' stage
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Clone the repository using your provided GitHub URL.
                    // Since it's a public repository, no specific credentials are needed here.
                    git branch: 'main', url: 'https://github.com/meghapaul196/travel-website.git'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Check if package.json exists to determine if npm install is needed.
                    // This is relevant if you add more complex frontend dependencies later.
                    if (fileExists('package.json')) {
                        sh 'npm install' // Or 'yarn install' if you prefer Yarn
                    } else {
                        echo 'No package.json found, skipping npm install.'
                    }
                }
            }
        }

        stage('Lint and Test (Optional)') {
            steps {
                script {
                    // This is a placeholder for linting and testing your code.
                    // You would typically have ESLint, Jest, etc. configured.
                    echo 'Running linting and tests (if configured)...'
                    // sh 'npm run lint' // Uncomment if you have a lint script
                    // sh 'npm test'   // Uncomment if you have a test script
                }
            }
        }

        // Corrected SonarQube Analysis Stage
        stage('SonarQube Analysis') {
            steps {
                script {
                    withSonarQubeEnv('Sonarkey') {
                        sh '''
                            sonar-scanner
                            -Dsonar.projectKey=travelaja
                            -Dsonar.projectName="Travelaja Website"
                            -Dsonar.sources=.
                            -Dsonar.exclusions=bookings.json,node_modules/**
                            -Dsonar.sourceEncoding=UTF-8
                            -Dsonar.javascript.linter.eslint.reportPaths=eslint-report.json
                            -Dsonar.javascript.node.maxspace=2048
                        '''
                    }
                }
            }
            // The 'post' block for a stage MUST be here,
            // directly inside the stage block, at the same level as 'steps'.
            post {
                failure {
                    echo 'SonarQube analysis failed or Quality Gate not passed.'
                }
            }
        }

        stage('Build (Optional)') {
            steps {
                script {
                    echo 'No specific build step required for this static site.'
                    // sh 'npm run build' // Uncomment if you have a build script
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo 'Starting deployment...'
                    sh 'kill $(lsof -t -i:5500) || true'
                    sh 'nohup node server.js > server.log 2>&1 &'
                    echo 'Node.js server started on port 5500.'
                    echo 'Deployment complete!'
                }
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