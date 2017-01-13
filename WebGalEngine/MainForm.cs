using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using CefSharp;
using CefSharp.WinForms;

namespace WebGalEngine
{
    public partial class MainForm : Form
    {
        public ChromiumWebBrowser chromeBrowser;

        public void InitializeChromium()
        {
            CefSettings settings = new CefSettings();
            // Initialize cef with the provided settings
            Cef.Initialize(settings);
            // Create a browser component

            String page = string.Format(@"{0}\html\index.html", Application.StartupPath);
            // Get current file page

            chromeBrowser = new ChromiumWebBrowser(page);
            // Add it to the form and fill it to the form window.
            //this.Controls.Add(chromeBrowser);
            mainPanel.Controls.Add(chromeBrowser);
            chromeBrowser.Dock = DockStyle.Fill;

            BrowserSettings browserSettings = new BrowserSettings();
            browserSettings.FileAccessFromFileUrls = CefState.Enabled;
            browserSettings.UniversalAccessFromFileUrls = CefState.Enabled;
            chromeBrowser.BrowserSettings = browserSettings;

            chromeBrowser.MenuHandler = new ContextMenu();
        }

        public MainForm()
        {
            InitializeComponent();

            InitializeChromium();
        }

        private void MainForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            Cef.Shutdown();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {

        }

        private void mainPanel_Paint(object sender, PaintEventArgs e)
        {

        }
    }
}
