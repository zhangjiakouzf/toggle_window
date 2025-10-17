/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
import Meta from 'gi://Meta';

const { Gio } = imports.gi;

const ToggleWindowInterface = `
<node>
  <interface name="cn.extensions.toggleWindow">
	<method name="ToggleWindowByWMClassName">
	  <arg name="wmClassName" type="s" direction="in" />
	  <arg name="found" type="b" direction="out" />
	</method>
  </interface>
</node>
`;
export default class ToggleWindow {
	#dbus;

	constructor() {
	}

	enable() {
		this.#dbus = Gio.DBusExportedObject.wrapJSObject(
			ToggleWindowInterface,
			this,
		);
		this.#dbus.export(
			Gio.DBus.session,
			'/cn/extensions/toggleWindow',
		);
	}

	disable() {
		this.#dbus.unexport_from_connection(
			Gio.DBus.session,
		);
		this.#dbus = undefined;
	}
	ToggleWindowByWMClassName(wmClassName) {
		console.log("toggle-window:","enter ToggleWindowByWMClassName:"+wmClassName)
                let windows = global.get_window_actors()
                        .map(actor => actor.get_meta_window())
                        .sort((a,b)=>(a.user_time-b.user_time));
                let focused_window = windows.filter(window => window.has_focus() && window.get_wm_class() === wmClassName);
                let unfocused_window = windows.filter(window => !window.has_focus() && window.get_wm_class() === wmClassName);

                focused_window.forEach(
                        window => {
                                console.log("toggle-window:","minimize:"+window.get_wm_class()+" id:"+window.get_stable_sequence())
                                window.minimize();

                        }
                )
                for (let window of unfocused_window) {
                        console.log("toggle-window:","activate:"+window.get_wm_class()+" id:"+window.get_stable_sequence())
                        window.activate(global.get_current_time());
                        break; // 仅处理第一个窗口后退出
                }
                return focused_window.length > 0 || unfocused_window.length > 0;
        }
}
