var generators = require('yeoman-generator');

function dependencyObjectToArray(dependency) {
    var dependencies = [];

    Object.keys(dependency).forEach(function(key) {
        dependencies.push(key + '@' + dependency[key]);
    });
}

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
            },
            {
                type: 'confirm',
                name: 'runInstall',
                message: 'Run npm install on new project?',
                default: false
            }
        ], function (answers) {
            this.appName = answers.name;
            this.framework = answers.framework;
            this.shouldRunInstall = answers.runInstall;
            done();
        }.bind(this));
    },
    writing: function() {
        var appRoot;
        var package;

        // only create new folder under current if they did not take the default
        if (this.appname !== this.appName) {
            appRoot = this.destinationPath(this.appName);
            this.mkdir(appRoot);
            process.chdir(appRoot);
        }

        package = this.fs.readJSON(this.templatePath('common/' + this.framework + '/package.json'));
        package.name = this.appName;

        this.fs.writeJSON(this.destinationPath('package.json'), package);

        this.fs.copy(
            this.templatePath(this.framework),
            this.destinationPath()
        );

        // copy the common jshintrc file to .jshintrc, template files
        // that start with '.' get skip if we just specify a directory
        this.fs.copy(
            this.templatePath('common/jshintrc'),
            this.destinationPath('.jshintrc')
        );

        this.package = package;
    },
    install: function() {
        var dependencies;

        if (this.shouldRunInstall) {
            if (this.package.dependencies) {
                dependencies = dependencyObjectToArray(this.package.dependencies);
                this.npmInstall(dependencies);
            }

            if (this.package.devDependencies) {
                dependencies = dependencyObjectToArray(this.package.devDependencies);
                this.npmInstall(dependencies);
            }
        }
    },
    end: function() {
        if (this.shouldRunInstall) {
            // do grunt build if they chose kraken
            if (this.framework === 'kraken') {
                this.spawnCommand('grunt', ['build']);
            }
        }
    }
});