
## Project Lithium

Trying to find a best way to implement auto-complete feature.

Requirements: [Vanilla JS](http://vanilla-js.com/)

Principles:

1. Memory consumption and efficiency
2. Unit-testable and reusable

Features according to principle #1

* Create buffer before append DOMs, although it may be a common sense now.
* Prefer browser's native features like `forEach` and `querySelectorsAll`,
instead of implementing this same features in JavaScript.

* Data structures, caches, algorithms.

Features according to principle #2:

* Isolate impure and pure computations via simple contexts.
But this may conflicts with principle #1.

* Utility functions include some high-order functions.
* Simple test module and functions. 

---

## License 

Project Lithium: Trying to find a best way to implement auto-complete feature (C) 2012 Greg Weng, snowmantw@gmail.com

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.
