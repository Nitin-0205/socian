pipeline{
    agent any 

    tools {
        nodejs : 'nodejs18'
    }
    
        stage("Install Node.js Dependencies") {
            steps {
                sh 'rm -rf package-lock.json node_modules'
                sh 'npm install'
                //sh 'npm ci'
            }
        }
}