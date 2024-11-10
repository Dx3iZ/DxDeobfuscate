from base64 import b64decode
from zlib import decompress, error as ZlibError
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

def unobfuscate(obfuscated_str: bytes) -> str:
    result = obfuscated_str[::-1]
    result = b64decode(result)
    result = decompress(result)
    return result

def decode_utf8(byte_string):
    try:
        decoded_string = byte_string.decode('utf-8').encode('utf-8').decode('raw_unicode_escape')
        return decoded_string
    except UnicodeDecodeError as e:
        return f"Decode error: {e}"


def obufs():
    obfuscated_code = request.form['code']
    obfuscated_code = bytes(obfuscated_code, 'utf-8')

    while True:
        deobfuscate = unobfuscate(obfuscated_code)
        
        if deobfuscate.startswith(b"exec((_)(b'"):
            start_idx = len(b"exec((_)(b'")
            end_idx = deobfuscate.find(b"'", start_idx)
            
            if end_idx != -1:
                obfuscated_code = deobfuscate[start_idx:end_idx]
            else:
                decode_utf8("zlibError")
                break
        else:
            return decode_utf8(deobfuscate)
            break
    return decode_utf8(deobfuscate)

@app.route('/process_code', methods=['POST'])
def process_code():
    result = obufs()
    return jsonify(result=result)

if __name__ == '__main__':
    app.run()
