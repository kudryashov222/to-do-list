function Item(data) {
    this.title = ko.observable(data.title);
    this.file = ko.observable(data.file);
    this.flag = ko.observable(data.flag);
    this.editing = ko.observable(false);
    this.edit = function() {this.editing(true)};
}

function ListToDO() {
    var self = this;
    self.tasks = ko.observableArray([]);
    self.filesName = ko.observableArray([]);
    self.newTaskText = ko.observable("");
    self.newTaskFile = ko.observable("");
    self.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), function(task) { return task.flag(); });
    });
    function localstorage(){
        localStorage.setItem('localtest_list_to_do', ko.toJSON(self.tasks()));
    };
    // self.clearHistory = function() {
    //     localStorage.removeItem('localtest_list_to_do');
    // };
    self.local_input = function() {
        localStorage.setItem("local_input", this.newTaskText());
    };
    self.addListItem = function() {
        self.tasks.push(new Item({ title: this.newTaskText() }));
        self.newTaskText("");
        localstorage();
        localStorage.removeItem('local_input');
    };
    self.removeTask = function(task) {
        self.tasks.remove(task);
        localstorage();
    };
    self.local = function() {
        localstorage();
    };
    self.removeAllTask = function(task) {
        self.tasks.removeAll(task.incompleteTasks());
        localstorage();
    };
    self.loadHistory = function() {
        var todos = ko.utils.parseJson(localStorage.getItem('localtest_list_to_do'));
        var mappedTasks = todos.map(function(item) { return new Item(item) });

        var fileTo = ko.utils.parseJson(localStorage.getItem('local_input_file'));
        var mappedFiles = fileTo.map(function(item) { return new Item(item) });

        var storedValue = localStorage.getItem("local_input");

        if (storedValue) {
            self.newTaskText(storedValue);
        };
        if (todos) {
            self.tasks(mappedTasks);
        };
        if (fileTo) {
            self.filesName(mappedFiles);
        };
    };
    self.addFileItem = function() {
        self.filesName.push(new Item({ file: this.newTaskFile() }));
        self.newTaskFile("");
        localStorage.setItem('local_input_file', ko.toJSON(self.filesName()));
    };
    self.removeFileItem = function(task) {
        self.filesName.remove(task);
        localStorage.setItem('local_input_file', ko.toJSON(self.filesName()));
    };

}

ko.bindingHandlers.tooltipster = {
    init: function(element, valueAccessor){
        $(element).tooltipster(ko.unwrap(valueAccessor()));
    }
};


var a = new ListToDO();
ko.applyBindings(a);

// $(document).ready(function() {
//     $('body').on('mouseover', '[data-toggle="tooltip"]', function() {
//         $('[data-toggle="tooltip"]').tooltip();
//     });
// });
