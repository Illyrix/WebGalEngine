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
            this.mainPanel.ClientSize = this.currentPanelSize = new Size(width, height);
        }

        public void fullScreenDisplay()
        {
            this.currentPanelSize = new Size(this.mainPanel.ClientSize.Width, this.mainPanel.ClientSize.Height);

            this.WindowState = FormWindowState.Normal;
            this.FormBorderStyle = FormBorderStyle.None;
            this.WindowState = FormWindowState.Maximized;
            this.mainPanel.Dock = DockStyle.Fill;

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
            Cef.Initialize(settings);

            String page = string.Format(@"{0}\html\index.html", Application.StartupPath);

            chromeBrowser = new ChromiumWebBrowser(page);
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
            this.currentPanelSize = new Size(1600, 900);

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
