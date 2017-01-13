using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CefSharp;

namespace WebGalEngine
{
    class ContextMenu : CefSharp.IContextMenuHandler
    {
        const CefMenuCommand CEF_MENU_OPEN_DEV_TOOLS = CefMenuCommand.UserFirst;

        public void OnBeforeContextMenu(IWebBrowser browserControl, IBrowser browser, IFrame frame, 
            IContextMenuParams parameters, IMenuModel model)
        {
            model.Clear();
#if DEBUG
            model.AddItem(CEF_MENU_OPEN_DEV_TOOLS, "Dev Tools");
#endif
        }

        public bool OnContextMenuCommand(IWebBrowser browserControl, IBrowser browser, IFrame frame, IContextMenuParams parameters,
            CefMenuCommand commandId, CefEventFlags eventFlags)
        {
#if DEBUG
            if (commandId == CEF_MENU_OPEN_DEV_TOOLS)
            {
                browser.ShowDevTools();
                return true;
            }
#endif
            return false;
        }

        public void OnContextMenuDismissed(IWebBrowser browserControl, IBrowser browser, IFrame frame)
        {

        }

        public bool RunContextMenu(IWebBrowser browserControl, IBrowser browser, IFrame frame,
            IContextMenuParams parameters, IMenuModel model, IRunContextMenuCallback callback)
        {
#if DEBUG
            return false;
#else
            return true;
#endif
        }
    }
}
