var Item = function (data) {
    this.title = ko.observable(data.title);
    this.flag = ko.observable(data.flag);
    this.editing = ko.observable(false);
    this.edit = function() {this.editing(true)};
}

function ListToDO() {
    var self = this;
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable("");
    self.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), function(task) { return task.flag(); });
    });
    function localstorage(){
        localStorage.setItem('localtest', ko.toJSON(self.tasks()));
    };
    self.clearHistory = function() {
          localStorage.removeItem('localtest')
    };
    self.addListItem = function() {
        self.tasks.push(new Item({ title: this.newTaskText() }));
        self.newTaskText("");
        localstorage();
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
        var todos = ko.utils.parseJson(localStorage.getItem('localtest'));
        var mappedTasks = [$.map(todos, function(item) { return new Item(item) })];

        //    mappedTasks.push(mappedTasks);
        // for (i=0;i<mappedTasks.length;i++){
        //     alert(mappedTasks[i]);
        // }
        // self.tasks(mappedTasks);
    if (todos) {
        var mappedTasks = $.map(todos, function(item) { return new Item(item) });
        self.tasks(mappedTasks);
    };
    };

}
var a = new ListToDO();


ko.applyBindings(a);
