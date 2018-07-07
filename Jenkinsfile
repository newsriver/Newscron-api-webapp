#!groovy​

def marathonAppId = '/newscron/newscron-api-webapp'
def projectName = 'newsriver-io/newscron-api-webapp'
def dockerRegistry = 'gcr.io'
def marathonURL = 'http://leader.mesos:8080/'





node {


    stage 'checkout project'
    checkout scm
    stage 'checkout lib'
    checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'Newscron-lib']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github', url: 'https://github.com/newsriver/Newscron-lib.git']]])


    stage 'set-up project'
    writeFile file: 'settings.gradle', text: '''rootProject.name = \'''' + projectName + '''\' \ninclude \'Newscron-lib\' '''

    angular2Compile()



    stage 'compile'
    sh 'gradle compileJava'

    stage 'test'
    sh 'gradle test'




    if (env.BRANCH_NAME == "master") {
        deployDockerImage(projectName, dockerRegistry)
        restartDockerContainer(marathonAppId, projectName, dockerRegistry, marathonURL)
    }

}



def restartDockerContainer(marathonAppId, projectName, dockerRegistry, marathonURL) {
    stage 'deploy application'
    marathon(
            url: "$marathonURL",
            forceUpdate: true,
            appid: "$marathonAppId",
            docker: "$dockerRegistry/$projectName:${env.BUILD_NUMBER}"
    )
}



def angular2Compile() {

    stage 'angular2'

    // uncomment these 2 lines and edit the name 'node-8.11.3' according to what you choose in configuration
    def nodeHome = tool name: 'node-8.11.3', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"


    dir('app') {

        stage 'update global modules'
        sh 'npm install npm@latest -g'
        sh 'npm cache verify'
        sh 'npm update -g'
        stage 'install modules'
        //sh 'rm -rf node_modules && rm -rf dist'
        sh 'npm update --dev'
        stage 'build'
        sh 'npm run build-prod-webapp'
    }

}


def deployDockerImage(projectName, dockerRegistry) {

    stage 'build'
    initDocker()
    sh 'gradle clean'
    sh 'gradle build'

    dir('docker') {
        deleteDir()
    }
    sh 'mkdir docker'

    dir('docker') {
        sh "cp ../build/libs/$projectName-*.war ."
        sh "cp ../newrelic-agent/newrelic-*.jar ."
        sh "cp ../newrelic-agent/newrelic.yml ."
        sh 'cp ../Dockerfile .'
        docker.withRegistry("https://$dockerRegistry/") {
            stage 'build docker image'
            def image = docker.build("$projectName:latest")
            stage 'upload docker image'
            image.push(env.BUILD_NUMBER)
        }
    }
}

def initDocker() {
    def status = sh(script: 'docker ps', returnStatus: true)
    if (status != 0) {
        sh 'service docker start'
    }
    sh 'docker login -u _json_key -p "$(cat Newsriver-60566afa2bab.json)" https://gcr.io'
}
