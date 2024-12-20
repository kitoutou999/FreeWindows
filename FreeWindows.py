import ctypes
import os
import sys
import subprocess
from threading import Timer
import webbrowser
import winreg
from flask import Flask, render_template, request, jsonify
from elevate import elevate

app = Flask(__name__)

# Chemin du répertoire contenant les fichiers
FILES_DIR = 'C:/Windows/System32/linuxCMD/'

def is_admin():
    try:
        return os.getuid() == 0
    except AttributeError:
        return ctypes.windll.shell32.IsUserAnAdmin()

def requires_admin():
    if not is_admin():
        print("Requesting administrative privileges...")
        elevate(show_console=True)
        if not is_admin():
            print("Privilege elevation was denied.")
            sys.exit()
            
            
def add_to_system_path(path):
    with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r'SYSTEM\CurrentControlSet\Control\Session Manager\Environment', 0, winreg.KEY_READ | winreg.KEY_WRITE) as key:
        current_path, _ = winreg.QueryValueEx(key, 'Path')
        if path not in current_path:
            new_path = current_path + ';' + path
            winreg.SetValueEx(key, 'Path', 0, winreg.REG_EXPAND_SZ, new_path)

def check_and_create_path(path):
    if path not in os.environ['PATH']:
        add_to_system_path(path)
    
    if not os.path.exists(path):
        os.makedirs(path)

@app.route('/')
def home():
    files = os.listdir(FILES_DIR)
    return render_template('index.html', files=files)

@app.route('/file/<filename>')
def get_file_content(filename):
    file_path = os.path.join(FILES_DIR, filename)
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            content = file.read()
        return jsonify({'content': content})
    else:
        return jsonify({'error': 'File not found'}), 404

@app.route('/save', methods=['POST'])
def save_file_content():
    filename = request.form['filename']
    content = request.form['content']
    file_path = os.path.join(FILES_DIR, filename)
    try:
        with open(file_path, 'w') as file:
            file.write(content)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/create', methods=['POST'])
def create_file():
    data = request.get_json()
    filename = data.get('filename')
    file_path = os.path.join(FILES_DIR, filename)
    try:
        with open(file_path, 'w') as file:
            file.write('')  
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete', methods=['POST'])
def delete_file():
    data = request.get_json()
    filename = data.get('filename')
    file_path = os.path.join(FILES_DIR, filename)
    try:
        os.remove(file_path)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/execute', methods=['POST'])
def execute_command():
    data = request.get_json()
    command = data.get('command')
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return jsonify({'output': result.stdout + result.stderr})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def open_browser():
    webbrowser.open('http://127.0.0.1:5000')

if __name__ == "__main__":
    requires_admin()
    check_and_create_path(FILES_DIR)
    Timer(1, open_browser).start()
    app.run(host='0.0.0.0', port=5000, debug=False)
    
    