using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CefSharp;
using CefSharp.WinForms;
using System.Diagnostics;

namespace WebGalEngine
{
    class EngineObject
    {
        // Declare a local instance of chromium and the main form in order to execute things from here in the main thread
        private static ChromiumWebBrowser _instanceBrowser = null;
        // The form class needs to be changed according to yours
        private static MainForm _instanceMainForm = null;


        public EngineObject(ChromiumWebBrowser originalBrowser, MainForm mainForm)
        {
            _instanceBrowser = originalBrowser;
            _instanceMainForm = mainForm;
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
    }
}
