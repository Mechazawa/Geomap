from flask import Flask, request, jsonify, render_template
import subprocess
import re
import urllib2
import pygeoip

app = Flask(__name__, static_folder='static', static_url_path='/static')
ipv4 = re.compile(r"(?:[\d]{1,3})\.(?:[\d]{1,3})\.(?:[\d]{1,3})\.(?:[\d]{1,3})")
gi = pygeoip.GeoIP('GeoLiteCity.dat', pygeoip.MEMORY_CACHE)
ip = ipv4.findall(urllib2.urlopen("http://checkip.dyndns.org/").read())[0]

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/connections")
def json_connections():
    return jsonify({
        "server": gi.record_by_addr(ip),
        "connections": [gi.record_by_addr(x) for x in connections()]
    })


def connections():
    ns = subprocess.Popen(["netstat", "-an"], stdout=subprocess.PIPE).communicate()[0]
    ns = '\n'.join(x for x in ns.split('\n') if 'TIME_WAIT' not in x)
    ips = ipv4.findall(ns)
    ips = list(set(ips))  # uniq
    return [x for x in ips if x.split('.')[0] not in ['0', '127', '10', '168']]

if __name__ == "__main__":
    app.debug = True
    app.run()
