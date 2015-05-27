var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    prompting: function () {
        var done = this.async();
        this.prompt({
            type    : 'input',
            name    : 'name',
            message : 'Your project name',
            default : this.appname // Default to current folder name
        }, function (answers) {
            this.appName = answers.name;
            done();
        }.bind(this));
    },
    writing: function() {
        var appRoot = this.appRoot = this.destinationPath(this.appName);
        var files = [
            'package.json',
            'index.js',
            'public/index.js',
            'public/views/index.jsx',
            'public/views/layout.jsx'
        ];
        var that = this;

        this.mkdir(appRoot);
        process.chdir(appRoot);

        files.forEach(function(file) {
            that.fs.copy(
                that.templatePath(file),
                that.destinationPath(file)
            );
        });
    }
});