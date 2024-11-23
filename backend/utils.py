import zipfile
import tempfile
import json

def pack_template(template_data):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.nixdlt') as temp_file:
        with zipfile.ZipFile(temp_file, 'w', zipfile.ZIP_DEFLATED) as zf:
            template_name = template_data['displayName']
            zf.writestr(f"{template_name}/config.json", json.dumps({
                "id": template_data['id'],
                "displayName": template_data['displayName'],
                "description": template_data['description'],
                "tags": template_data['tags']
            }, indent=2))
            for resource in template_data['resources']:
                resource_path = f"{template_name}/types/{resource['type'].lower()}s/{resource['name']}/config.json"
                zf.writestr(resource_path, json.dumps(resource['config'], indent=2))
                if resource['type'] == 'MODEL' and 'source' in resource['config']:
                    src_folder = f"{template_name}/types/models/{resource['name']}/src/"
                    source = resource['config']['source']
                    if 'requirements' in source:
                        zf.writestr(f"{src_folder}requirements.txt", source['requirements'])
                    if 'init' in source:
                        zf.writestr(f"{src_folder}__init__.py", source['init'])
                    if 'config' in source:
                        zf.writestr(f"{src_folder}config.py", source['config'])
                    if 'model' in source:
                        zf.writestr(f"{src_folder}model.py", source['model'])
    return temp_file.name