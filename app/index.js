var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    prompting: function () {
        var done = this.async();
        this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname // Default to current folder name
            },
            {
                type: 'list',
                name: 'framework',
                message: 'Framework',
                choices: [
                    {
                        name: 'express',
                        value: 'express'
                    },
                    {
                        name: 'kraken',
                        value: 'kraken'
                    }
                ]
            }
        ], function (answers) {
            this.appName = answers.name;
            this.framework = answers.framework;
            done();
        }.bind(this));
    },
    writing: function() {
        var appRoot = this.appRoot = this.destinationPath(this.appName);
        var package;

        this.mkdir(appRoot);
        process.chdir(appRoot);

        package = this.fs.readJSON(this.templatePath('common/' + this.framework + '/package.json'));
        package.name = this.appName;

        this.fs.writeJSON(this.destinationPath('package.json'), package);

        this.fs.copy(
            this.templatePath(this.framework),
            this.destinationPath()
        );
    }
});