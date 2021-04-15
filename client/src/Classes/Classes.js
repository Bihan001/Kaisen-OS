class MainFile {
  constructor(name, date_created, date_modified, creator, path, type) {
    this.name = name;
    this.dateCreated = date_created;
    this.dateModified = date_modified;
    this.editableBy = creator;
    this.path = path;
    this.type = type;

    this.minimized = false;
    this.closed = false;
    this.zindex = 0;
  }
}

class ClassFolder extends MainFile {
  constructor(name, date_created, date_modified, creator, path, type, children) {
    super(name, date_created, date_modified, creator, path, type);
    this.children = children;
  }
}

class ClassFile extends MainFile {
  constructor(name, date_created, date_modified, creator, path, type, content) {
    super(name, date_created, date_modified, creator, path, type);
    this.content = content;
  }
}

export { ClassFolder, ClassFile };
