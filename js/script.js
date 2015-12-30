function Item(data) {
    this.title = ko.observable(data.title);
    this.flag = ko.observable(data.flag);
    this.editing = ko.observable(false);
    this.edit = function() {this.editing(true)};
}
function File(data) {
    this.file = ko.observable(data.file);
    this.bas64 = ko.observable(data.bas64);
}
function ListToDO() {
    var self = this;
    self.tasks = ko.observableArray([]);
    self.filesName = ko.observableArray([]);
    self.newTaskText = ko.observable("");
    self.newTaskFile = ko.observable("");
    self.ErrorFile = ko.observable("");
    self.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), function(task) { return task.flag(); });
    });
    function localstorage(){
        localStorage.setItem('localtest_list_to_do', ko.toJSON(self.tasks()));
    };

    var holder = document.getElementById('dropFile');

    holder.ondragover = function () {
          this.className = 'hover'; return false;
    };

    holder.ondrop = function (e) {
      e.preventDefault();
      this.className = 'not-hover';
      var file = e.dataTransfer.files[0];

      switch(file.type)
      {
          case 'image/png':
          case 'image/gif':
          case 'image/jpeg':
          fr = new FileReader();
          fr.onload = function(e){
              e=fr.result;
              self.filesName.push(new File({ file: file.name, bas64: e }));
              self.newTaskFile("");
              self.ErrorFile("");
              localStorage.setItem('local_input_file', ko.toJSON(self.filesName()));
          };
          fr.readAsDataURL(file);
          break;
          default:
          self.ErrorFile("Unsupported File!");
          self.newTaskFile("");
      }
    };
    function handleFileSelect(){
      input = document.getElementById('file');
      file = input.files[0];

      switch(file.type)
      {
          case 'image/png':
          case 'image/gif':
          case 'image/jpeg':
          fr = new FileReader();
          fr.onload = function(e){
              e=fr.result;
              self.filesName.push(new File({ file: file.name, bas64: e }));
              self.newTaskFile("");
              self.ErrorFile("");
              localStorage.setItem('local_input_file', ko.toJSON(self.filesName()));
          };
          fr.readAsDataURL(file);
          break;
          default:
          self.ErrorFile("Unsupported File!");
          self.newTaskFile("");
      }
    }
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
        var mappedFiles = fileTo.map(function(item) { return new File(item) });
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
        handleFileSelect();
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


// $(document).ready(function(){
//     var holder = document.getElementById('dropFile');

//     holder.ondrop = function (e) {
//       e.preventDefault();
//       var file = e.dataTransfer.files[0];
//       $('#file').attr('value', file.name);
//     };
// });
