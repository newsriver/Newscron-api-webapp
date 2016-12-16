#!groovy​

def marathonAppId = '/newscron/newscron-api-webapp'
def projectName = 'newscron-api-webapp'
def dockerRegistry = 'docker-registry.newsriver.io:5000'
def marathonURL = 'http://46.4.71.105:8080/'

node {

    angular2Compile()


    stage 'checkout project'
    checkout scm
    stage 'checkout lib'
    checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'Newscron-lib']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github', url: 'https://github.com/newsriver/Newscron-lib.git']]])



    stage 'set-up project'
    writeFile file: 'settings.gradle', text: '''rootProject.name = \'''' + projectName + '''\' \ninclude \'Newscron-lib\' '''

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

    // uncomment these 2 lines and edit the name 'node-4.4.5' according to what you choose in configuration
    def nodeHome = tool name: 'node-7.2.1', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"


    dir('src/main/resources/static') {
        deleteDir()
    }

    dir('app') {

        stage 'install modules'
        sh 'npm install'
        sh 'npm update'
        
        sh 'ng build --target=production --environment=prod'
        sh 'mv dist  ../src/main/resources/static'
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
}