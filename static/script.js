function loadFileContent(filename) {
    
    
    fetch(`/file/${filename}`)  
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById('content').textContent = data.error;
            } else {
                document.getElementById('filename').value = filename;
                document.getElementById('content').value = data.content;
            }
        });
}

function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show';
    if (isError) {
        notification.classList.add('error');
    }
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

function saveFileContent(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('file-form'));
    fetch('/save', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('File saved successfully');
        } else {
            showNotification('Error while saving : ' + data.error, true);
        }
    });
}

function createFile(event) {
    event.preventDefault();
    const filename = document.getElementById('new-filename').value + '.bat';
    fetch('/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: filename })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('File created successfully');
            addFileToList(filename.slice(0, -4));
        } else {
            showNotification('Error while creating : ' + data.error, true);
        }
    });
}

function deleteFile(filename) {
    fetch('/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: filename })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('File deleted successfully');
            removeFileFromList(filename.slice(0, -4));
        } else {
            showNotification('Error while deleting : ' + data.error, true);
        }
    });
}

function executeCommand(command) {
    const terminalOutput = document.getElementById('terminal-output');
    terminalOutput.textContent += `> ${command}\n`;
    fetch('/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: command })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            terminalOutput.textContent += `${data.error}\n`;
        } else {
            terminalOutput.textContent += `${data.output}\n`;
        }
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });
}

function addFileToList(filename) {
    const fileList = document.getElementById('item_liste');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div class="file-item">
            <a href="#" class="name-button" onclick="loadFileContent('${filename}.bat')">${filename}</a>
            <a href="#" class="delete-button" onclick="deleteFile('${filename}.bat')">x</a>
        </div>
    `;
    fileList.appendChild(listItem);
}

function removeFileFromList(filename) {
    const fileList = document.getElementById('item_liste');
    const items = fileList.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.querySelector('.name-button').textContent === filename) {
            fileList.removeChild(item);
            break;
        }
    }
}

document.getElementById('terminal-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const command = event.target.value;
        executeCommand(command);
        event.target.value = '';
    }
});
document.getElementById('new-filename').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        createFile(event);
    }
});
document.getElementById('content').addEventListener('keydown', function(event) {
    
    if (event.ctrlKey && event.key === 's') {
        
        event.preventDefault();
        saveFileContent(event);
    
        return false;
    }
});