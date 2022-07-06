# Toggle Window
For security reasons, since Gnome 41, cann't invoke '**org.gnome.Shell.Eval**' to control the behavior of window by some gjs source code directly anymore.  
So we have to move the actions into a gnome extension known as an "agent"(or something else), and expose a D-Bus interface to activate/minimized a window by its WM_CLASS for user.

* Get WMClass name of window

    We can use '**xprop WM_CLASS**' command to get the WMClass name.  
    For example:
```sh
        $xprop WM_CLASS
        WM_CLASS(STRING) = "gnome-terminal-server", "Gnome-terminal"
```

* Call method through DBus to control the window

    Then we can invokes the "**cn.extensions.toggleWindow.ToggleWindowByWMClassName**" method through dbus to toggle the window.  
    If the window is activated(on the front), it will be minimized, or the window will be activated.
    So you can map a lot of keyboard shortcuts to navigate between your favorite X-programs without using mouse.  
    For example:
```sh
        $gdbus call --session \
                --dest org.gnome.Shell \
                --object-path /cn/extensions/toggleWindow \
                --method cn.extensions.toggleWindow.ToggleWindowByWMClassName 'Gnome-terminal'
```
