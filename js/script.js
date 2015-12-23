function Item(data) {
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

    self.addListItem = function() {
        self.tasks.push(new Item({ title: this.newTaskText() }));
        self.newTaskText("");
    };
    self.removeTask = function(task) { self.tasks.remove(task); };
    self.removeAllTask = function(task) { self.tasks.removeAll(task.incompleteTasks()); };
}

ko.applyBindings(new ListToDO());
