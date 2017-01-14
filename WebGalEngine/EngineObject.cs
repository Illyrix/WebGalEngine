using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CefSharp;
using CefSharp.WinForms;
using System.Diagnostics;
using System.Windows.Forms;
using System.IO;

namespace WebGalEngine
{
    class EngineObject
    {
        // Declare a local instance of chromium and the main form in order to execute things from here in the main thread
        private static ChromiumWebBrowser _instanceBrowser = null;
        // The form class needs to be changed according to yours
        private static MainForm _instanceMainForm = null;
        
        public string readFile(string relativePath)
        {
            string realPath = string.Format(@"{0}\" + relativePath, Application.StartupPath);
            if (!this.existsFile(relativePath))
                throw new Exception("No such file");
            StreamReader sr = new StreamReader(realPath);
           return sr.ReadToEnd();
        }

        public bool existsFile(string relativePath)
        {
            string realPath = string.Format(@"{0}\" + relativePath, Application.StartupPath);
            return System.IO.File.Exists(realPath);
        }

        public void writeFile(string relativePath, string data, bool append = true)
        {
            string realPath = string.Format(@"{0}\" + relativePath, Application.StartupPath);
            if (append)
                System.IO.File.AppendAllText(realPath, data);
            else
                System.IO.File.WriteAllText(realPath, data);
        }
        
        
        public void resize(int width = 1920, int height = 1080)
        {
            _instanceMainForm.resizePanel(width, height);
        }

        public void windowedDisplay()
        {
            _instanceMainForm.windowedDisplay();
        }

        public void fullScreenDisplay()
        {
            _instanceMainForm.fullScreenDisplay();
        }

        public EngineObject(ChromiumWebBrowser originalBrowser, MainForm mainForm)
        {
            _instanceBrowser = originalBrowser;
            _instanceMainForm = mainForm;
        }
        
    }
}
