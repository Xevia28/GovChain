const path = require('path')

exports.getLoginForm = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'login.html'))
}

exports.getHome = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'))
}

exports.getReopened = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'repoened.html'))
}

exports.getContact = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'contact.html'))
}

exports.getCurrentResults = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'currentresults.html'))
}

exports.getFaq = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'faq.html'))
}

exports.getResults = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'results.html'))
}

exports.getVote = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'vote.html'))
}

exports.getDashboard = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dashboard.html'))
}

exports.getAdmin = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'admin.html'))
}

exports.getReopenTopic = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'topicreopen.html'))
}

exports.getAdminCrud = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'admincrud.html'))
}

exports.getCurrentTopic = (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'adminresult.html'))
}