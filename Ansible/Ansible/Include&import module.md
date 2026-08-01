**Include Module**: Using include module user can add only tasks from other file another playbook.
- While including tasks from one file to another playbook user can perform variable substitution, Using include module you can also include complete playbook into  another playbook.
- This can be useful to tie together a few independent playbook into a larger
- Playbook including is a bit more primitive than task inclusion .you cannot perform variable substitution when including a playbook you cannot apply condition and you can apply tags either

**include_taks module**- include_taks also working similar to include module but there are few fundamentals differences.
- only include tasks. Tasks not used to include complete playbook.
- At runtime, include_tasks will work as separate tasks and user get the entry in output.

-----
import_tasks and import_playbook
- Import_Tasks and import_playbook work similar to include and include_tasks.
#### Include vs import_playbook:

- All import statements are pre-processed at the time playbook are parsed
- All include statements are processed as they are encountered during the execution of the playbook.
