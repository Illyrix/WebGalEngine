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
        
        private Size currentPanelSize;

        public void resizePanel(int width, int height)
        {
            this.mainPanel.Size = new Size(width, height);
        }

        public void fullScreenDisplay()
        {
            this.currentPanelSize = new Size(this.mainPanel.ClientSize.Width, this.mainPanel.ClientSize.Height);

            this.FormBorderStyle = FormBorderStyle.None;
            //this.TopMost = true;
            //Rectangle ret = Screen.GetWorkingArea(this);
            //Rectangle ret = Screen.PrimaryScreen.Bounds;

            //this.Size = new Size(ret.Width, ret.Height);
            this.WindowState = FormWindowState.Maximized;
            //this.mainPanel.ClientSize = new Size(ret.Width, ret.Height);
            this.mainPanel.Dock = DockStyle.Fill;
            //this.mainPanel.BringToFront();

            this.BringToFront();
        }

        public void windowedDisplay()
        {
            this.mainPanel.ClientSize = this.currentPanelSize;
            this.mainPanel.Dock = DockStyle.None;
            this.WindowState = FormWindowState.Normal;
            this.FormBorderStyle = FormBorderStyle.Sizable;
        }

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
            // TODO: 从配置文件load分辨率
            currentPanelSize = new Size(1600, 900);

            InitializeComponent();

            InitializeChromium();
            // Register an object in javascript named "EngineObject" with function of the EngineObject class
            chromeBrowser.RegisterJsObject("EngineObject", new EngineObject(chromeBrowser, this));
        }

        private void MainForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            Cef.Shutdown();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            System.Windows.Forms.Control.CheckForIllegalCrossThreadCalls = false;
        }

        private void mainPanel_Paint(object sender, PaintEventArgs e)
        {

        }
    }
}
