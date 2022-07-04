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
class ToggleWindow {
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
		for (const actor of global.get_window_actors()) {
			const window = actor.get_meta_window();
			if (window.get_wm_class().includes(wmClassName)) {
				if( window.has_focus() ){
					global.log(wmClassName+"'s minimized")
					window.minimize()
				}else{
					global.log(wmClassName+"'s activated")
					window.activate(global.get_current_time());
				}
				return true;
			}
		}

		return false;
	}
}

function init() {
	return new ToggleWindow();
}
